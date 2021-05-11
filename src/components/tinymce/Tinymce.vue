<template>
    <div class="tinymce" v-loading="loading" element-loading-text="加载中...">
        <div class="tinymce-editor tinymce-container editor-container" :class="{fullscreen:fullscreen}">
            <editor :id="tinymceId" :init="init" v-model="tinyVal" @onClick="onClick"></editor>
<!--            <div class="editor-custom-btn-container">
                <editor-image color="#1890ff" class="editor-upload-btn" v-on:imageSuccess="imageSuccess"></editor-image>
            </div>-->
        </div>
    </div>
</template>

<script>
import tinymce from 'tinymce'
import editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
//import editorImage from './EditorImage'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
export default {
    name: "Tinymce",
    components: {
        //editorImage,
        editor
    },
    props: {
        id: {
            type: String,
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        value: {
            type: String,
            default: ''
        },
        plugins: {
            type: [String, Array],
            default: 'lists image media table wordcount'
        },
        toolbar: {
            type: [String, Array],
            default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        }
    },
    watch: {
        value(val) {
            this.$nextTick(() =>
                this.tinyVal = val
            )
        },
        tinyVal(val) {
            this.$emit('input', val)
        }
    },
    data() {
        return {
            // 初始化配置
            hasChange: false,
            tinymceId: this.id,
            fullscreen: false,
            editorContent: '',
            hasInit: false,
            loading: true,
            init: {
                fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
                language: 'zh_CN',
                language_url: '/tinymce/langs/zh_CN.js',
                skin_url: '/tinymce/skins/ui/oxide',
                content_css: '/tinymce/skins/content/default/content.css',
                selector: `#${this.tinymceId}`,
                height: 500,
                body_class: 'panel-body ',
                object_resizing: false,
                toolbar: this.toolbar,
                menubar: this.menubar,
                plugins: this.plugins,
                end_container_on_empty_block: true,
                powerpaste_word_import: 'clean',
                code_dialog_height: 450,
                code_dialog_width: 1000,
                advlist_bullet_styles: 'square',
                advlist_number_styles: 'default',
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true,
                automatic_uploads: false,
                images_upload_url: 'postAcceptor.php',
                file_picker_types: 'file image media',
                init_instance_callback: (editor) => {
                    this.loading = false;
                },
                setup: (editor) => {
                    editor.on('FullscreenStateChanged', e => {
                        this.fullscreen = e.state
                    })
                },
                images_upload_handler: (blob, success, fail) => {
                    return this.uploadHandler(blob, success, fail)
                }
            },
            tinyVal: ''
        }
    },
    mounted() {
        tinymce.init({})
    },
    methods: {
        onClick(e) {
            this.$emit('onClick', e, tinymce)
        },
        uploadHandler(blob, success, fail) {
            this.$api.upload().then(res => {
                
            })
        },
        // 图片上传成功后填充到富文本编辑器
        async imageSuccess(urlList) {
            try {
                let imageTemplateList = '';
                urlList.forEach(item => {
                    const image = `<img style="max-width:100%;" src="${item}">`;
                    imageTemplateList = imageTemplateList + image
                });
                tinymce.get(this.tinymceId).insertContent(imageTemplateList);
                this.$message.success('上传成功')
            } catch (error) {
                this.$message.error(error.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tinymce {
  min-height: 500px;
}

.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container > > > .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
